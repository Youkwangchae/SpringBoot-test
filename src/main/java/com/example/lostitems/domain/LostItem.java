package com.example.lostitems.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "lost_items")
public class LostItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String building;

	private LocalDate foundDate;

	private String storage;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ItemStatus status = ItemStatus.STORED;

	protected LostItem() {
	}

	public LostItem(String name, String building, LocalDate foundDate, String storage) {
		this.name = name;
		this.building = building;
		this.foundDate = foundDate;
		this.storage = storage;
	}

	public void markReturned() {
		this.status = ItemStatus.RETURNED;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getBuilding() {
		return building;
	}

	public LocalDate getFoundDate() {
		return foundDate;
	}

	public String getStorage() {
		return storage;
	}

	public ItemStatus getStatus() {
		return status;
	}
}
