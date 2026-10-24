package com.example.lostitems;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.lostitems.repository.LostItemRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class LostItemApiTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private LostItemRepository repository;

	@BeforeEach
	void setUp() {
		repository.deleteAll();
	}

	@Test
	@DisplayName("등록하면 목록에 보인다")
	void registeredItemAppearsInList() throws Exception {
		register("지갑", "공학관");

		mockMvc.perform(get("/items"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].name").value("지갑"))
				.andExpect(jsonPath("$[0].status").value("STORED"));
	}

	@Test
	@DisplayName("건물로 필터링된다")
	void listIsFilteredByBuilding() throws Exception {
		register("지갑", "공학관");
		register("우산", "도서관");

		mockMvc.perform(get("/items").param("building", "공학관"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].name").value("지갑"));
	}

	@Test
	@DisplayName("반환 처리하면 상태가 RETURNED가 된다")
	void returnChangesStatusToReturned() throws Exception {
		long id = register("지갑", "공학관");

		mockMvc.perform(patch("/items/{id}/return", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("RETURNED"));

		mockMvc.perform(get("/items/{id}", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("RETURNED"));
	}

	@Test
	@DisplayName("없는 id는 404")
	void unknownIdReturnsNotFound() throws Exception {
		mockMvc.perform(get("/items/{id}", 999_999L))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("이미 반환된 물건은 409")
	void returningAlreadyReturnedItemReturnsConflict() throws Exception {
		long id = register("지갑", "공학관");
		mockMvc.perform(patch("/items/{id}/return", id))
				.andExpect(status().isOk());

		mockMvc.perform(patch("/items/{id}/return", id))
				.andExpect(status().isConflict());
	}

	/** 물건을 등록하고 응답에 담긴 id를 돌려준다. */
	private long register(String name, String building) throws Exception {
		String body = """
				{"name":"%s","building":"%s","foundDate":"2026-10-20","storage":"1층 경비실"}
				""".formatted(name, building);

		MvcResult result = mockMvc.perform(post("/items")
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isCreated())
				.andReturn();

		Number id = JsonPath.read(result.getResponse().getContentAsString(), "$.id");
		return id.longValue();
	}
}
